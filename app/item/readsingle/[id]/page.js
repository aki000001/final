import Image from "next/image"
import Link from "next/link"

const getSingleItem = async (id) => {
    const response = await fetch(`http://localhost:3000/api/item/readsingle/${id}`, {cache:"no-store"});
    const jsonDate = await response.json()
    const singleItem = jsonDate.singleItem
    return singleItem
}

const ReadSingleItem = async (context) => {
    const singleItem = await getSingleItem(context.params.id)
    return (
    <div className="grid-container-si"> 
        <div>
            <Image src={singleItem.image} width={450} height={300} alt="item-image" priority/>
        </div>
        <div>
            <h1>{singleItem.title}</h1>
            <h2>¥{singleItem.price}</h2>
            <hr/>
            <p>{singleItem.description}</p>
            <div>
                <Link href={`/item/update/${singleItem._id}`}>アイテム編集</Link>
                <Link href={`/item/delete/${singleItem._id}`}>アイテム削除</Link>
            </div>
        </div>
    </div>
    )
}

export default ReadSingleItem