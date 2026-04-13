"use client";

import { API_ROUTES, ROUTES } from "@/lib/routes";
import { useUser } from "@clerk/nextjs";
import {
    getDownloadURL,
    getStorage,
    ref,
    uploadBytesResumable
} from "firebase/storage";
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react';
import { app } from '../../firebase';

export default function CreateListing() {
    const {isSignedIn, user, isLoaded} = useUser();
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [imageUploadError, setImageUploadError] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const route = useRouter();

    // If user is signed in but userMongoId is missing, sync the account first
    useEffect(() => {
        if (!isLoaded || !isSignedIn || !user) return;
        if (user.publicMetadata?.userMongoId) return;

        const sync = async () => {
            setSyncing(true);
            try {
                const res = await fetch('/api/user/ensure-synced', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    await user.reload(); // refresh session so publicMetadata is up to date
                }
            } catch (err) {
                console.error('Sync error:', err);
            } finally {
                setSyncing(false);
            }
        };
        sync();
    }, [isLoaded, isSignedIn, user]);
    const [formData, setFormData] = useState({
         imageUrls: [],
         name: '',
         description: '',
         address: '',
         type: 'rent',
         bathrooms: 1,
         bedrooms: 1,
         regularprice: 50,
         discountedprice: 0,
         offer: false,
         parking: false,
         furnished: false,
    
    });

    console.log(formData);
    
    const handleImageSubmit = async (e) => {
        if (files.length>0 && files.length+formData.imageUrls.length <7){
            setUploading(true);
            setImageUploadError(null);
            const promises=[];
            for (let i= 0; i<files.length; i++){
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
            .then((urls)=>{
                setFormData({
                    ...formData,
                    imageUrls:formData.imageUrls.concat(urls),
                });
                setImageUploadError(null);
                setUploading(false);
            })
            .catch((err)=>{
                setImageUploadError('Failed to upload images (2mb max per image).');
                setUploading(false);
            });
        } else {
            setImageUploadError('Please select at least one image and a maximum of 6 images.');
            setUploading(false);
        }
    };


    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage=getStorage(app);
            const filename=new Date().getTime() +  file.name;
            const storageRef=ref(storage, filename);
            const uploadTask=uploadBytesResumable(storageRef, file);

            uploadTask.on(
                `state_changed`,
                (snapshot)=>{
                    const progress=(snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    console.log(`Upload is ${progress}% done`);
                },
                (error)=>{
                    reject(error);
                },
                ()=>{
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                        resolve(downloadURL);
                    });
                }
            );
        });
    };
    
    const handleRemoveImagae = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i)=> i !== index),
        });
    };


    const handleChange = (e) => {
  const { id, value, type, checked } = e.target;

  // Sale / Rent toggle
  if (id === "sale" || id === "rent") {
    setFormData((prev) => ({
      ...prev,
      type: id,
    }));
    return;
  }

  // Checkbox fields
  if (type === "checkbox") {
    setFormData((prev) => ({
      ...prev,
      [id]: checked,
    }));
    return;
  }

  // Number fields
  if (type === "number") {
    setFormData((prev) => ({
      ...prev,
      [id]: Number(value),
    }));
    return;
  }

  // Text & textarea fields
  setFormData((prev) => ({
    ...prev,
    [id]: value,
  }));
};




    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!isLoaded) {
            setError('User data is still loading. Please wait.');
            return;
        }
        if (!isSignedIn || !user || !user.publicMetadata || !user.publicMetadata.userMongoId) {
            setError('You must be signed in to create a listing.');
            return;
        }
        try{
            if(formData.imageUrls.length <1)
                return setError('Please upload at least one image.');

            if(+formData.regularprice < +formData.discountedprice)
                return setError('Discounted price should be less than regular price.');
            setLoading(true);
            setError(false);
            const res = await fetch(API_ROUTES.listingCreate, {
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userMongoId: user.publicMetadata.userMongoId,
                }),
            });
            const data = await res.json();
            setLoading(false);
            if(data.success===false){
                setError(data.message);
                return;
            }
            route.push(ROUTES.listing(data.data._id));
        } catch (err){
            setError(err?.message);
            setLoading(false);
        }
    };




      // Clerk still initialising
      if (!isLoaded) {
        return (
          <main className='p-3 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-3'>
            <div className='w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin' />
            <p className='text-slate-500 text-sm'>Loading...</p>
          </main>
        );
      }

      // Not signed in — block the page entirely
      if (!isSignedIn) {
        return (
          <main className='p-3 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-4'>
            <p className='text-2xl font-semibold text-slate-700'>Sign in required</p>
            <p className='text-slate-500 text-sm'>You must be signed in to create a listing.</p>
            <a
              href={ROUTES.signIn}
              className='bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg transition-colors'
            >
              Sign In
            </a>
          </main>
        );
      }

      // Signed in but account is being synced / metadata not ready yet
      if (syncing || !user?.publicMetadata?.userMongoId) {
        return (
            <main className='p-3 max-w-4xl mx-auto flex flex-col items-center justify-center min-h-[60vh] gap-3'>
                <div className='w-8 h-8 border-4 border-slate-300 border-t-slate-700 rounded-full animate-spin' />
                <p className='text-slate-500 text-sm'>Setting up your account, please wait...</p>
            </main>
        );
      }

      return(
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Create a Listing
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'
            onSubmit={handleSubmit}>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                       type='text'
                       placeholder='Name'
                       className='border p-3 rounded-lg'
                       id='name'
                       maxLength='62'
                       minLength='10'
                       required
                       onChange={handleChange}
                       value={formData.name}
                       />
                    <textarea 
                       type='text'
                       placeholder='description'
                       className='border p-3 rounded-lg'
                       id='description'
                       required
                       onChange={handleChange}
                       value={formData.description}
                          />
                    <input
                          type='text'
                          placeholder='address'
                          className='border p-3 rounded-lg'
                          id='address'
                          required
                          onChange={handleChange}
                          value={formData.address}
                          />
                
                <div className='flex flex-wrap gap-6'>
                    <div className='gap-2 flex'>
                         <input type='checkbox' id='sale' className='w-5' 
                         onChange={handleChange}
                         checked={formData.type === 'sale'}
                         />
                         <span>sell</span>
                    </div>
                    <div className='gap-2 flex'>
                         <input type='checkbox' id='rent' className='w-5'
                         onChange={handleChange}
                         checked={formData.type === 'rent'}
                         />
                        <span>rent</span>
                    </div>
                    <div className='gap-2 flex'>
                         <input  type='checkbox' id='parking' className='w-5'
                            onChange={handleChange}
                            checked={formData.parking}
                        />
                        <span>Parking Spot</span>
                    </div>
                    <div className='gap-2 flex'>
                        <input type='checkbox'  id='furnished' className='w-5'
                            onChange={handleChange}
                            checked={formData.furnished}
                        />  
                       <span>Furnished</span>
                    </div>
                    <div className='gap-2 flex'>
                         <input type='checkbox'  id='offer' className='w-5'
                            onChange={handleChange}
                            checked={formData.offer}
                         />  
                     <span>Offer</span>
                    </div>
                    </div>
                    <div className='flex-wrap flex gap-6'>
                    <div className='gap-2 items-center flex'>
                        <input
                         type='number'
                         id='bedrooms'
                         min={1}
                         max={10}
                         required
                         className=' p-2 border-gray-400 border rounded-lg'
                        onChange={handleChange}
                        value={formData.bedrooms}
                        />
                        <p>Beds</p>
                    </div>
                    <div className='gap-2 items-center flex'>
                        <input
                          type='number'
                          id='bathrooms'
                          min={1}
                          max={10}
                          required
                          className=' p-2 border-gray-400 border rounded-lg'
                          onChange={handleChange}
                          value={formData.bathrooms}
                        />
                       <p>Baths</p>
                    </div>
                    <div className='gap-2 items-center flex'>
                        <input  
                          type='number'
                          id='regularprice'
                          min={50}
                          max={100000000}
                          required
                          className=' p-2 border-gray-400 border rounded-lg'
                            onChange={handleChange}
                            value={formData.regularprice}
                        />
                        <p>Regular Price</p>
                     </div>
                     {formData.offer && (
                     <div className='gap-2 items-center flex'>
                         <input  
                           type='number'
                           id='discountedprice'
                           min={0}
                          max={100000000}
                           className=' p-2 border-gray-400 border rounded-lg'
                            onChange={handleChange}
                            value={formData.discountedprice}
                         />
                        <div className='flex flex-col items-center'>
                         <p>Discounted Price</p>
                         <span className="text-xs">(Rs. / month)</span>
                        </div>
                     </div>
                     )}
              </div>
              </div>
                <div className='flex flex-col flex-1 gap-4'>
                    <p className='text-lg font-semibold'>
                        Images:
                        <span className="font-normal text-sm ml-2 text-gray-400">
                            The first image will be the cover image (Max 6)
                            </span>
                            </p>
                            <div className='flex gap-4'>
                               <input
                                  className='border  p-3 rounded-lg w-full'
                                  type='file'
                                  id='images'
                                    accept='.jpg,.png,.jpeg,.webp'
                                    multiple
                                    required
                                    onChange={(e)=> {
                                        setFiles(e.target.files)
                                    }}
                                    />
                            <button
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            className='border border-black text-green-700 p-3 rounded-lg'>
                                {uploading ? 'Uploading...' : 'Upload Images'}
                            </button>
                            </div>
                            <p className='text-red-500 text-sm'>
                                {imageUploadError && imageUploadError}
                            </p>
                            {formData.imageUrls.length >0 &&
                               formData.imageUrls.map((url, index)=> (
                                <div
                                key={url}
                                className='flex justify-between p-3 border items-center'
                                >
                                    <img
                                    src={url}
                                    alt='listing image'
                                    className='w-20  h-20 object-contain rounded-lg'
                                    />
                                    <button
                                    type="button"
                                    onClick={()=>{handleRemoveImagae(index)}}
                                    className=' bg-gray-200 text-red-500  p-3 uppercase rounded-lg hover:opacity-95'
                                    >
                                        Delete
                                    </button>
                                </div>
                               
                               ))}
                            <button className='bg-slate-700 text-white p-3 rounded-lg'
                            disabled={loading || uploading}
                            >
                                {loading ? 'Creating ...' : 'Create Listing'}
                            </button>   
                            {error && <p className='text-red-700 text-sm mt-2'>{error}</p>} 
                </div>
            </form>
        </main>
        );
}