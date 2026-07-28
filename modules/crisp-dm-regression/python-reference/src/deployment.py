import pickle
import gzip
import os

def save_model_pickle(model, file_path):
    """
    使用 pickle 儲存模型
    """
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "wb") as f:
        pickle.dump(model, f)
    print(f"Model saved to {file_path}")

def save_model_gzip(model, file_path):
    """
    使用 gzip 壓縮並儲存模型
    """
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with gzip.open(file_path, "wb") as f:
        pickle.dump(model, f)
    print(f"Model saved (gzipped) to {file_path}")

def load_model_gzip(file_path):
    """
    載入 gzip 壓縮的模型
    """
    with gzip.open(file_path, "rb") as f:
        model = pickle.load(f)
    print(f"Model loaded from {file_path}")
    return model
