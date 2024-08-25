"use client"

import { useRecoilState } from "recoil"
import { modalState } from  "../atom/modelAtom"

const CommentModal = () => {

    const [open ,setOpen] = useRecoilState(modalState)

  return (
    <div>
              <h1>Comment Modal</h1>
           {open && (
            <div className="">
                <h1>Hello baby open</h1>
            </div>
           )}
    </div>
  )
}

export default CommentModal
