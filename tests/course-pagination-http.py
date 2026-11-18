import json,os,subprocess,time,urllib.request,urllib.error,tempfile,socket
with socket.socket() as listener:
 listener.bind(('127.0.0.1',0));port=listener.getsockname()[1]
server_log=tempfile.TemporaryFile(mode='w+')
p=subprocess.Popen(['node','node_modules/next/dist/bin/next','dev','-H','127.0.0.1','-p',str(port)],stdout=server_log,stderr=subprocess.STDOUT,env={**os.environ,'NEXT_TELEMETRY_DISABLED':'1'})
def req(query):
 assert p.poll() is None,'owned server exited; refuse another listener'
 try:
  with urllib.request.urlopen(f'http://127.0.0.1:{port}/api/courses?'+query,timeout=30) as r:
   result=(r.status,json.load(r))
   assert p.poll() is None,'owned server exited during request'
   return result
 except urllib.error.HTTPError as e:return e.code,json.load(e)
try:
 for i in range(45):
  try:status,data=req('page=abc');break
  except (urllib.error.URLError,TimeoutError):time.sleep(1)
 else:raise AssertionError('server failed')
 print('invalid_page_status',status,'pagination',data.get('pagination'),flush=True)
 assert status==400,'invalid page must be rejected'
 for q in ['limit=abc','page=Infinity','page=1.5','page=-1','limit=0','page=9007199254740991&limit=50']:
  status,data=req(q);assert status==400,(q,status)
 for q,page,limit in [('',1,12),('page=2&limit=5',2,5),('limit=99',1,50)]:
  status,data=req(q);assert status==200
  assert data['pagination']['page']==page and data['pagination']['limit']==limit
  assert len(data['items'])<=limit
 print('10 HTTP cases PASS (no course contents logged)')
finally:
 p.terminate()
 try:p.wait(timeout=10)
 except subprocess.TimeoutExpired:p.kill();p.wait()
 server_log.close()
