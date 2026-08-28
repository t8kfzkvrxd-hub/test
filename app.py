import os
import random

from flask import Flask, redirect, render_template, request, session, url_for

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "local-development-secret-key")


def start_game():
    """Start a fresh game for the current browser."""
    session["answer"] = random.randint(1, 100)
    session["count"] = 0
    session["message"] = "1〜100の数字を当ててください！"
    session["game_over"] = False


@app.route("/", methods=["GET", "POST"])
def home():
    if "answer" not in session:
        start_game()

    if request.method == "POST":
        if session.get("game_over"):
            return redirect(url_for("home"))

        try:
            guess = int(request.form.get("guess", ""))
        except ValueError:
            session["message"] = "1〜100の整数を入力してください。"
        else:
            if not 1 <= guess <= 100:
                session["message"] = "1〜100の範囲で入力してください。"
            else:
                session["count"] += 1
                if guess > session["answer"]:
                    session["message"] = f"{guess} は大きすぎます。もっと小さい！"
                elif guess < session["answer"]:
                    session["message"] = f"{guess} は小さすぎます。もっと大きい！"
                else:
                    session["message"] = f"🎉 正解！ {session['count']}回で当たりました！"
                    session["game_over"] = True

        return redirect(url_for("home"))

    return render_template(
        "index.html",
        count=session["count"],
        message=session["message"],
        game_over=session["game_over"],
    )


@app.post("/restart")
def restart():
    start_game()
    return redirect(url_for("home"))


if __name__ == "__main__":
    # 同じWi-Fi内の端末からもアクセスできるようにする。
    app.run(host="0.0.0.0", port=5000, debug=False)
