import React from 'react'

export const PostComponent = ({image, content, userimage, username, userhandle}: {image:string, content:string, userimage:string, username:string, userhandle:string}) => {
  return (
    <div className='border-y-[1px] border-slate-500'>
        <h3>{content}</h3>
    </div>
  )
}
