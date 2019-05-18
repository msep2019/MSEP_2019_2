from flask import Flask, render_template, url_for

app = Flask(__name__)

@app.route('/')
def homepage():

    try:
        return render_template("index.html")
    except Exception as e:
        return render_template("error.html")

@app.route('/user-profile')
def user_profile():

    try:
        return render_template("user-profile.html")
    except Exception as e:
        return render_template("error.html")

if __name__ == '__main__':

    app.run(host='0.0.0.0', debug=True)
