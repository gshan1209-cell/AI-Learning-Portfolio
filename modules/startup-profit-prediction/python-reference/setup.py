import os
import pandas as pd

# 確保資料夾存在
os.makedirs("data", exist_ok=True)

# 1. 自動下載 50 Startups 資料集
data_path = "data/50_Startups.csv"
if not os.path.exists(data_path):
    print("正在下載資料集...")
    url = "https://raw.githubusercontent.com/krishnaik06/Multiple-Linear-Regression/master/50_Startups.csv"
    df = pd.read_csv(url)
    df.to_csv(data_path, index=False)
    print("資料集下載完成！")

# 2. 進行模型訓練與儲存
print("正在訓練模型...")
try:
    from preprocessing import preprocess_data
    from train_model import train_model, save_model
except ModuleNotFoundError:
    from src.preprocessing import preprocess_data
    from src.train_model import train_model, save_model

df = pd.read_csv(data_path)
X_train, X_test, y_train, y_test = preprocess_data(df)
model = train_model(X_train, y_train)
save_model(model)
print("模型訓練與儲存完成！")
