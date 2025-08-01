from flask import Flask, render_template, request, redirect, url_for, session, jsonify, send_from_directory
from config.logutil import Logger
import os
import json

app = Flask(__name__)
app.secret_key = os.urandom(24)  # 随机密钥

# 加载日志模块
logger = Logger(log_file_path='app.log', log_level='INFO')

# 登录页用户名密码, 前期用Json key-value代替, 后期做link mysql用户登录表
user_json_path = './app/static/database'
user_json_file = 'user.json'


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
            with open(os.path.join(user_json_path, user_json_file), 'r') as f:
                users_list = json.load(f)  # users: list[{u,p}, {u,p}]
            logger.info(f'/login load Json file success.')
        except FileNotFoundError as e:
            print(f'error: {e}')
            return jsonify({'success': False, 'message': 'Json file not found.'}), 500

        user_found = False
        for users_index in users_list:
            if users_index["username"] == username and users_index["password"] == password:
                session['username'] = username
                logger.info(f"user '{username}' login to system.")
                return jsonify({'success': True, 'message': 'login success'})

        logger.error('username or password error.')
        return jsonify({'success': False, 'message': 'username or password error.'})
    # 当GET请求时
    return render_template('login.html', message='')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        try:
            with open(os.path.join(user_json_path, user_json_file), 'r') as f:
                users_list = json.load(f)
            logger.info('/register load json file success.')
        except FileNotFoundError:
            if not os.path.exists(user_json_path):
                os.makedirs(user_json_path)
                with open(os.path.join(user_json_path, user_json_file), 'w') as f:
                    f.write('')
            users_list = []
            # return jsonify({'success': False, 'message': 'Json file not found.'}), 500
        # print(f'users_list: {users_list}, {type(users_list)}')

        user_found = False
        for users_index in users_list:
            if users_index["username"] == username:
                logger.info(f'user {username} has exists, please input correct password.')
                return render_template('login.html', message='')

        user = {}  # 待注册新用户dict
        if not user_found:
            user['username'] = username
            user['password'] = password
        users_list.append(user)

        try:
            with open(os.path.join(user_json_path, user_json_file), 'w') as f:
                json.dump(users_list, f, indent=4)
            return jsonify({'success': True, 'message': 'register success.'})
        except Exception as e:
            return jsonify({'success': False, 'message': f'register fail: {str(e)}'}), 500

@app.route('/home')
def home():
    return render_template(template_name_or_list='home.html')

@app.route('/aboutus')
def aboutus():
    return render_template(template_name_or_list='aboutus.html')

@app.route('/menu')
def menu():
    return render_template(template_name_or_list='menu.html')

@app.route('/featured')
def featured():
    return render_template(template_name_or_list='featured.html')