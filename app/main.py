from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template(template_name_or_list='index.html')

@app.route('/aboutus')
def aboutus():
    return render_template(template_name_or_list='aboutus.html')

if __name__ == '__main__':
    app.run(debug=True, port=8000, host='0.0.0.0')