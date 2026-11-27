import { Eraser, Sparkles, UploadCloud, X } from 'lucide-react';
import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {

  const [input, setInput] = useState(null)
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

  // ✕ button click karne par input clear karne ke liye function
  const handleRemoveImage = () => {
    setInput(null);
    setPreview(null);
    // Input element ki value reset karna taaki same image dobara select ho sake
    const fileInput = document.getElementById('file-upload');
    if (fileInput) fileInput.value = "";
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)

      const formData = new FormData()
      formData.append('image', input)

      const { data } = await axios.post('/api/ai/remove-image-background', formData,
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

      {/* Left col - Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-300'>

        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Background Removal</h1>
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

          {/* Label with Darker Border on Hover focus */}
          <label 
            htmlFor="file-upload" 
            className={`group relative flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-xl transition-all cursor-pointer
              ${preview 
                ? 'border-[#FF4938] bg-orange-50' 
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
                <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:shadow-md transition-shadow">
                    {/* <Sparkles className="w-6 h-6 text-[#FF4938]" /> */}
                    <UploadCloud className="w-8 h-8 text-[#FF4938]" />
                </div>
                <p className="text-sm text-gray-600 font-medium">
                  <span className="text-[#FF4938]">Click to upload</span> 
                </p>
                <p className="text-xs text-gray-500 mt-1">Supports JPG, PNG, and other image formats</p>
              </div>
            )}
          </label>

          {/* Updated cross icon handler */}
          {input && (
            <div className="mt-2 flex items-center gap-2 text-[11px] font-medium text-gray-600 bg-gray-200 w-fit px-2 py-1 rounded">
              <span className="truncate max-w-[200px]">{input.name}</span>
              <button 
                type="button" 
                onClick={handleRemoveImage} 
                className="text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        <button disabled={loading} className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#F6AB41] to-[#FF4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:opacity-95 transition-opacity'>
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Eraser className='w-5' />
          )}
          Remove Background
        </button>
      </form>

      {/* Right col - Output */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-300 min-h-96'>
        <div className='flex items-center gap-3'>
          <Eraser className='w-5 h-5 text-[#FF4938]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>
        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-500'>
              <Eraser className='w-9 h-9' />
              <p>Upload an image and click "Remove Background" to get started</p>
            </div>
          </div>
        ) : (
          <img src={content} alt="processed" className='mt-3 w-full h-full object-contain' />
        )}
      </div>
    </div>
  )
}

export default RemoveBackground