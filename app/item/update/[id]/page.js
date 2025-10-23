"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useAuth from "../../../utils/useAuth"

const UpdateItem = (context) => {
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState("")
    const [image, setImage] = useState("")
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(true) // ←追加

    const router = useRouter()
    const loginUserEmail = useAuth()

    useEffect(() => {
        const getSingleItem = async (id) => {
            const response = await fetch(`http://localhost:3000/api/item/readsingle/${id}`, { cache: "no-store" });
            const jsonDate = await response.json()
            const singleItem = jsonDate.singleItem
            setTitle(singleItem.title)
            setPrice(singleItem.price)
            setImage(singleItem.image)
            setDescription(singleItem.description)
            setEmail(singleItem.email)
            setLoading(false) // ←データ取得完了
        }
        getSingleItem(context.params.id)
    }, [context])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`http://localhost:3000/api/item/update/${context.params.id}`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    title,
                    price,
                    image,
                    description,
                    // emailはサーバーで決まるので不要
                }),
            })
            const jsonData = await response.json()
            alert(jsonData.message)
            router.push("/")
            router.refresh()
        } catch {
            alert("アイテム編集失敗")
        }
    }

    // 👇 追加：読み込み中の表示
    if (loading || !loginUserEmail) {
        return <p>ログイン情報を読み込み中...</p>
    }

    // 👇 読み込み完了してから判定
    if (loginUserEmail.loginUserEmail === email)
{
        return (
            <div>
                <h1 className="page-title">アイテム編集</h1>
                <form onSubmit={handleSubmit}>
                    <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" name="title" placeholder="タイトル" required />
                    <input value={price} onChange={(e) => setPrice(e.target.value)} type="text" name="price" placeholder="価格" required />
                    <input value={image} onChange={(e) => setImage(e.target.value)} type="text" name="image" placeholder="画像" required />
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} name="description" rows={15} placeholder="商品説明" required></textarea>
                    <button>編集</button>
                </form>
            </div>
        )
    } else {
        return <h1>権限がありません</h1>
    }
}

export default function Page({ params }) {
    return <UpdateItem params={params} />;
}
