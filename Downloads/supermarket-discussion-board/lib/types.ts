export type Category = "肉" | "魚" | "野菜・果物" | "お菓子・飲料" | "日用品" | "その他"

export type Store = "ローソン大同工前店" | "ピアゴ柴田店" | "ヤマナカ柴田店" | "ウェルシア名古屋大同店"

export interface Media {
  id: string
  type: "image" | "video"
  url: string
}

export interface Reply {
  id: string
  threadId: string
  nickname: string
  content: string
  media?: Media[]
  createdAt: string
}

export interface Thread {
  id: string
  categories?: Category[]
  store: Store
  nickname: string
  title: string
  content: string
  rating?: number
  media?: Media[]
  replyCount: number
  likes: number
  createdAt: string
}
