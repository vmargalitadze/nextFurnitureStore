import React from 'react'

const page = async(props: {
  params:Promise< {id:string,locale: string} >
}) => {
  const { id, locale } = await props.params;
  
  return (
    <div> {id} </div>
  )
}

export default page