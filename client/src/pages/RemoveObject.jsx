import { Scissors, Sparkles, UploadCloud, X } from 'lucide-react'
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState(null)
  const [object, setObject] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const [preview, setPreview] = useState(null);

  const { getToken } = useAuth()

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput(file);
      setPreview(URL.createObjectURL(file));
      setContent(''); // Purana result clear karein
    }
  };

  // Function to remove image and reset input value
  const handleRemoveImage = () => {
    setInput(null);
    setPreview(null);
    // Important: input value reset karein taaki same file dobara select ho sake
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = "";
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      if (object.split(' ').length > 1) {
        setLoading(false)
        return toast.error('Please enter only one object name')
      }

      const formData = new FormData()
      formData.append('image', input)
      formData.append('object', object)

      const { data } = await axios.post('/api/ai/remove-image-object', formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } })

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left col - Input Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-300'>

        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Upload image</p>

        <div className="mt-2">
          <input
            id="file-upload"
            onChange={handleFileChange}
            type="file"
            accept='image/*'
            className='hidden'
            required
          />

          {/* Upload Label with improved hover and focus states */}
          <label 
            htmlFor="file-upload" 
            className={`group relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl transition-all cursor-pointer
              ${preview 
                ? 'border-[#4A7AFF] bg-blue-50' 
                : 'border-gray-400 bg-gray-50 hover:bg-gray-100 hover:border-gray-500' 
              }`}
          >
            {preview ? (
              <div className="relative w-full h-full p-2">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-full h-full object-contain rounded-lg" 
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                  <p className="text-white text-xs font-medium">Click to Change Image</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:shadow-md transition-all">
                    {/* <Sparkles className="w-6 h-6 text-[#4A7AFF]" /> */}
                    <UploadCloud className="w-8 h-8 text-[#4A7AFF]" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  <span className="text-[#4A7AFF]">Click to upload</span> 
                </p>
                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, and other image formats</p>
              </div>
            )}
          </label>

          {/* File name badge with Reset Logic */}
          {input && (
            <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-gray-500 bg-gray-100 w-fit px-2 py-1 rounded border border-gray-200">
              <span className="truncate max-w-[200px]">{input.name}</span>
              <button 
                type="button" 
                onClick={handleRemoveImage} 
                className="text-red-500 hover:text-red-700 font-bold ml-1 px-1"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>

        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-400 focus:border-[#4A7AFF] transition-colors placeholder-gray-500'
          placeholder='e.g., watch or spoon, only single object name'
          required
        />

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-90 transition-opacity'>
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Scissors className='w-5' />
          )}
          Remove Object
        </button>
      </form>

      {/* Right col - Output Display */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-300 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-500 text-center'>
              <Scissors className='w-12 h-12 ' />
              <p className="max-w-[250px]">Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 relative flex-1">
             <img src={content} alt="processed" className='w-full h-full object-contain rounded-lg border border-gray-100' />
             <a 
              href={content} 
              download="processed_image.png"
              className="absolute bottom-2 right-2 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm hover:bg-white transition-colors"
             >
               <Sparkles className="w-4 h-4 text-[#4A7AFF]" />
             </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default RemoveObject