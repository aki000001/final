// app/components/DeleteItem.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useAuth from "../../utils/useAuth";

export default function DeleteItem({ params }) {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();
  const loginUserEmail = useAuth()

  useEffect(() => {
    const getSingleItem = async () => {
      const res = await fetch(`/api/item/readsingle/${params.id}`, { cache: "no-store" });
      const data = await res.json();
      setTitle(data.singleItem.title);
      setPrice(data.singleItem.price);
      setImage(data.singleItem.image);
      setDescription(data.singleItem.description);
    };
    getSingleItem();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/item/delete/${params.id}`, {
        method: "DELETE",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: loginUserEmail }),
      });
      const jsonData = await res.json();
      alert(jsonData.message);
      router.push("/");
      router.refresh();
    } catch {
      alert("アイテム削除失敗");
    }
  }
  if (loginUserEmail === email) {
    return (
      <div>
        <h1 className="page-title">アイテム削除</h1>
        <form onSubmit={handleSubmit}>
          <h2>{title}</h2>
          {image && <Image src={image} width={450} height={300} alt="item-image" priority />}
          <h3>¥{price}</h3>
          <p>{description}</p>
          <button>削除</button>
        </form>
      </div>
    )
  } else {
    return <h1>権限がありません</h1>
  }
}