export default function CreateListing() {
      return(
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Create a Listing
            </h1>
            <form className='flex flex-col sm:flex-row gap-4'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                       type='text'
                       placeholder='Name'
                       className='border p-3 rounded-lg'
                       id='name'
                       maxLength='62'
                       minLength='10'
                       required
                       />
                    <textarea 
                       type='text'
                       placeholder='Description'
                       className='border p-3 rounded-lg'
                       id='description'
                       required
                          />
                    <input
                          type='text'
                          placeholder='Price'
                          className='border p-3 rounded-lg'
                          id='price'
                          required
                          />
                <div className='flex flex-wrap gap-6'>
                    <div className='gap-2 flex'>
                         <input
                                   type='checkbox'
                                   id='sale'
                                   className='w-5'
                                   />
                                   <span>sell</span>
                    </div>
                    <div className='gap-2 flex'>
                                <input
                                   type='checkbox'  
                                      id='rent'
                                      className='w-5'
                                      />
                                        <span>rent</span>
                    </div>
                    <div className='gap-2 flex'>
                                <input
                                   type='checkbox'
                                        id='Parking'
                                        className='w-5'
                                        />
                                        <span>Parking Spot</span>
                    </div>
                    <div className='gap-2 flex'>
                                <input
                                   type='checkbox'
                                        id='Furnished'
                                        className='w-5'
                                        />  
                                        <span>Furnished</span>
                    </div>
                    <div className='gap-2 flex'>
                                <input
                                   type='checkbox'  
                                        id='offer'
                                        className='w-5'
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
                                        />
                                        <p>Baths</p>
                    </div>
                    <div className='gap-2 items-center flex'>
                                <input  
                                      type='number'
                                        id='RegularPrice'
                                        min={100}
                                        max={10000}
                                        required
                                        className=' p-2 border-gray-400 border rounded-lg'
                                        />
                                        <p>Regular Price</p>

                     </div>
                    <div className='gap-2 items-center flex'>
                                 <input  
                                        type='number'
                                        id='DiscountedPrice'
                                        min={100}
                                        max={10000}
                                        className=' p-2 border-gray-400 border rounded-lg'
                                        />
                                        <p>Discounted Price</p>
                                        <span className="text-xs">(Rs. / month)</span>
                    </div>
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
                                  type='file'
                                  id='images'
                                    accept='.jpg,.png,.jpeg'
                                    multiple
                                    required
                                    className='border p-3 rounded-lg w-full'
                                    />
                            <button className='border border-black text-green-700 p-3 rounded-lg'>
                                Upload
                            </button>
                            </div>
                            <button className='bg-slate-700 text-white p-3 rounded-lg'>
                                CREATE LISTING
                            </button>    
                </div>
            </form>
        </main>
      )
}