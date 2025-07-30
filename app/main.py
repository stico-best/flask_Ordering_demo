from flask import Flask, render_template, request, redirect, url_for, session, jsonify
from config.logutil import Logger
import os
import json

app = Flask(__name__)
app.secret_key = os.urandom(24)  # 随机密钥
logger = Logger(log_file_path='app.log', log_level='INFO')

# 前期用dict代替, 后期做link mysql用户登录表
user_login = {
    'root': '123456'
}

user_json_path = 'database/user.json'

@app.route('/')
def login_page():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    print(request.method)
    # 当POST请求时
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        try:
            with open(user_json_path, 'r') as f:
                users = json.load(f)  # users: list[{u,p}, {u,p}]
            logger.info(f'用户账号密码Json已读取')
        except FileNotFoundError:
            return jsonify({'success': False, 'message': '用户数据文件不存在'}), 500

        user_found = False
        for user in users:
            if user["username"] == username and user["password"] == password:
                session['username'] = username
                logger.info(f"user '{username}' login to system.")
                return jsonify({'success': True, 'message': '登录成功'})

        logger.error('用户名或密码错误')
        return jsonify({'success': False, 'message': '用户名或密码错误'})
    # 当GET请求时
    return render_template('login.html', message='')

# @app.route('/register', methods=['POST'])
# def register():


@app.route('/home')
def home():
    return render_template(template_name_or_list='home.html')

@app.route('/aboutus')
def aboutus():
    return render_template(template_name_or_list='aboutus.html')