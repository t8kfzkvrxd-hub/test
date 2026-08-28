import random

# 1〜100の中から答えを決める
answer = random.randint(1, 100)

# 挑戦回数
count = 0

print("🎮 数当てゲーム")
print("1〜100の数字を当ててください！")

while True:
    guess = int(input("あなたの予想："))
    count += 1

    if guess > answer:
        print("もっと小さい！")

    elif guess < answer:
        print("もっと大きい！")

    else:
        print("🎉 正解！")
        print(f"{count}回で当たりました！")
        break