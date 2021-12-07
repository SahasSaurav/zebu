/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState} from 'react'
import localforage from 'localforage'

const LabelImages = () => {
  const [imageIndex, setImageIndex] = useState(0)
  const [images, setImages] = useState([])
  const [curreentImage, setCurrentimage] = useState('')
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [label, setLabel] = useState('')
  const [formError, setFormError] = useState('')

  const prevImage=()=>{
    setImageIndex(prevNumber=>{
      if(prevNumber === 0){
        return Number(images.length-1)
      }
      return Number(prevNumber)-1
    })
   
  }
  const nextImage=()=>{
    setImageIndex(prevNumber=>{
      if(prevNumber === images.length-1){
        return 0
      }
      return Number(prevNumber)+1
    })
  }

  const saveJsonFile=(content)=>{
    let linkElement = document.createElement('a')
    const file = new Blob([content], { type: 'text/plain' });
    linkElement.setAttribute('href', URL.createObjectURL(file))
    linkElement.download='zebu.json'
    linkElement.click()
  }

  const onFormSubmit=(e)=>{
    console.log('im fired')
    e.preventDefault()
    if(!label){
      setFormError('Label is required filed')
      return
    } else {
      setFormError('')
    }
    let jsonData={
      name:name,
      description:desc,
      label:label,
      images:images
    }
    saveJsonFile(JSON.stringify(jsonData, null, 2))
  }

  useEffect(()=>{
    localforage.getItem('saveData').then(data=>{
      if(Object.values(data).length > 0){
        if(data.name){
          setName(data.name)
        }
        if(data.description){
          setDesc(data.description)
        }
        if(data.images.length>0){
          setImages(data.images)
          setCurrentimage(data.images[0])
        }
      }
    })
  }, [])

  useEffect(()=>{
    if(imageIndex && images.length >0){
      setCurrentimage(images[imageIndex])
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageIndex])


  return (
    <div className="container mx-auto min-h-screen ">
      <h2 className="text-5xl font-semibold mt-3 mb-5">Label Images</h2>
      <div className="p-4 rounded-lg bg-gray-200  max-w-sm md:max-w-md  grid gap-3">
        <div className="flex flex-col gap-2 w-full max-w-sm md:max-w-md" >
          <label className="tetx-xl font-medium">Label</label>
          <input type="text" value={label} className="px-3 py-2 bg-gray-300 border-gray-300 border-2 rounded placeholder-gray-50" onChange={(e)=>setLabel(e.target.value)} placeholder="Type something..."  required/>
          {formError && (<span className="text-base font-medium text-red-400">{formError}</span>)}
        </div>
        <div className="w-full max-w-sm md:max-w-md  h-64 bg-gray-300  overflow-hidden">
          <img src={curreentImage} alt="image" className="object-cover rounded-lg " />
          {/* <p>{images.length}</p>
          <p> index: {imageIndex}</p> */}
        </div>
      </div>
      <div className="flex gap-2 p-4">
        <button className="px-4 py-2 bg-gray-800 text-gray-50 rounded disabled:bg-red-300" onClick={prevImage}>Prev</button>
        <button className="px-4 py-2 bg-gray-800 text-gray-50 rounded disabled:bg-red-300" onClick={nextImage}>Next</button>
        <button className="px-4 py-2 bg-gray-800 text-gray-50 rounded disabled:bg-red-300" onClick={(e)=>onFormSubmit(e)} >Save</button>
      </div>
    </div>
  )
}

export default LabelImages
