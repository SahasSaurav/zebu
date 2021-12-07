import { useState } from "react";
import {useDropzone} from 'react-dropzone'
import localforage  from "localforage";
import { useNavigate } from "react-router";

 
function CreateProject() {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImage] = useState([]);
  const [imageError, setImageError] = useState([]);
  const [formError, setFormError] = useState([])

  const navigate = useNavigate()

  const onImageDrop = (files) => {
    if (files.length > 0) {
      let maxNoOfImages = 5;
      let allowedExtensions = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
      let maxsizePerImage = 3 * 1024 * 1024; // 3mb

      let imageVaildExtension = files.length > 0 ? Object.values(files).map((file) => allowedExtensions.includes(file.type)) : null;
      let imageValidSize = files.length > 0 ? Object.values(files).map((file) => file.size < maxsizePerImage) : null;

      if (files.length > maxNoOfImages) {
        setImageError((prevError) => {
          if (prevError.includes("You can only select max 5 image.")) {
            return prevError;
          }
          return [...prevError, "You can only select max 5 image."];
        })
      } else if (imageVaildExtension && imageVaildExtension.includes(false)) {
        setImageError((prevError) => {
          if (prevError.includes( "Only jpeg, png and png is supported.")) {
            return prevError;
          }
          return [...prevError, "only jpeg, png and png is supported."];
        })
      } else if (imageValidSize && imageValidSize.includes(false)) {
        setImageError((prevError) => {
          if (prevError.includes("Each image size must be less than 3 mb.")) {
            return prevError;
          }
          return [...prevError, "Each image size must be less than 3 mb."];
        })
      } else {
        setImageError([]);
      }

      let images = Object.values(files).slice(0, 5);
      for (let image of images) {
        const reader = new FileReader();
        reader.onload = async (e) => {
          let dataUrl = await e.target.result;
          setImage((prevImage) => [...prevImage, dataUrl]);
        };
        reader.readAsDataURL(image);
      }
    }
  };

  const formOnSumbit = (e)=>{
    console.log('form is submited')
    e.preventDefault()
    try {
      if(images.length === 0){
        setFormError(prevError => {
          if(prevError.includes('Please select or drag and drop any images')){
            return prevError
          }
          return [...prevError,'Please select or drag and drop any images' ]
        })
      } else if (name.length === 0) {
        setFormError(prevError => {
          if(prevError.includes( 'Name is required field')){
            return prevError
          }
          return [...prevError, 'Name is required field' ]
        })
      } else if (desc.length === 0) {
        setFormError(prevError => {
          if(prevError.includes('Description is Required filed')){
            return prevError
          }
          return [...prevError,'Description is Required filed' ]
        })
      } else {
        setFormError([])
      }
      let data= {
        name:name,
        description:desc,
        images: images
      }
      localforage.setItem('saveData', data).then(()=> navigate('/label-images'))
    } catch (err) {
     console.error('Exception is occurred at formonsubmit', err.message) 
    }
  }

  const removeImages = () =>{
    setImageError([])
    setImage([])
  }

  const {getRootProps, getInputProps, isDragActive, } = useDropzone({
    onDrop: (files) => onImageDrop(files),
    maxFiles: 5,
    accept: "image/jpeg, image/jpg, image/png, image/webp",
  });

  return (
    <section className="container mx-auto min-h-screen flex flex-col justify-center">
      <h2 className="text-5xl font-semibold mt-3 mb-5">Create Project</h2>
      <form className="" onSubmit={(e)=>formOnSumbit(e)}>
        <div className="flex flex-col md:flex-row justify-start md:items-center gap-4  w-full">
        <fieldset className="max-w-md w-full order-2 md:order-1">
          <div className=" border-4 border-dashed border-gray-400 h-60   w-full overflow-hidden">
            <div  className="w-full h-60 flex flex-col justify-center items-center bg-gray-300" {...getRootProps()} >
              <input {...getInputProps()} />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto stroke-current fill-current text-gray-400"  fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              {images.length === 0 && (<span className="text-center text-lg font-medium">{isDragActive ? 'Drop the files here': 'Drag & Drop images here' }</span>)}
              {images.length > 0 && (<span  className="text-center text-lg font-medium">{images.length} image is selected.</span>)}
            </div>
          </div>
        </fieldset>
        <fieldset className="flex flex-col gap-5 order-1 md:order-2 max-w-md w-full ">
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-xl font-medium">Name</label>
            <input type="name" className="px-3 py-2 bg-gray-300 border-gray-300 border-2 rounded" value={name} onChange={(e) =>setName(e.target.value)} placeholder="Type Something...." required />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-xl font-medium">Description</label>
            <textarea  className="px-3 py-2 bg-gray-300 border-gray-300 border-2 rounded resize-y" value={desc} onChange={(e)=> setDesc(e.target.value)} style={{minHeight:'100px', maxHeight:'350px'}} placeholder="Type Something...." required></textarea>
          </div>
        </fieldset>
        </div>
        {imageError.length > 0 && (<span className="text-red-500">{imageError.join(' ')}</span>)}
        {formError.length > 0 && (<span className="text-red-500">{formError.join(' ')}</span>) }
        <div className="order-3 mt-4 w-full flex justify-center  max-w-xl">
          {images.length > 0 && (<button className="px-4 py-2 bg-red-500 text-gray-50 rounded mr-3" onClick={removeImages}>Remove Images</button>)}
          <button type="submit" className="px-4 py-2 bg-gray-800 text-gray-50 rounded disabled:bg-red-300" >Create</button>
        </div>
      </form>
    </section>
  );
}

export default CreateProject;

