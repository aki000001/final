"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"  // ← これを追加

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const router = useRouter()  // ← これも追加

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch("http://localhost:3000/api/user/login", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            })

            const jsonData = await response.json()

            // トークンを保存
            localStorage.setItem("token", jsonData.token)

            if (jsonData.message === "ログイン成功") {
                alert(jsonData.message)
                setEmail("")
                setPassword("")

                // ✅ ログイン成功したら /item/create に移動！
                router.push("/item/create")
                router.refresh()
            } else {
                alert("ログイン失敗")
            }
        } catch {
            alert("ログイン失敗")
        }
    }

    return (
        <div>
            <h1 className="page-title">ログイン</h1>
            <form onSubmit={handleSubmit}>
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="text"
                    name="email"
                    placeholder="メールアドレス"
                    required
                />
                <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    name="password"
                    placeholder="パスワード"
                    required
                />
                <button>ログイン</button>
            </form>
        </div>
    )
}

export default Login
