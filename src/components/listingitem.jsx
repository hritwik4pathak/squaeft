
import Link from "next/link";
import {MdLocationOn} from 'react-icons/md';
export default function ListingItems({listing}) {
    return(
        <div className="flex flex-col gap-2">
            <Link
            href={`/listing/${listing._id}`}>
                <img
                src={listing.imageUrls[0] ||
                'https://images.unsplash.com/photo-1501183638714-841dd81dca9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG91c2V8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60'}
                alt='listing cover'
                className="w-full h-80 hover:scale-105 transition-scale duration-300 object-cover rounded-md"
                />
                <div className="flex flex-col gap-2 p-3 w-full">
                    <p className="truncate text-lg font-semibold text-slate-700">
                        {listing.name}
                    </p>
                    <div className="flex items-center gap-1">
                        <MdLocationOn className="text-green-700 h-4 w-4" />
                        <p className="text-slate-500 text-sm truncate w-full">
                            {listing.address}
                        </p>
                    </div>
                    <p className="text-sm line-clamp-2 text-slate-500">
                        {listing.description}
                    </p>
                    <p className="text-lg mt-2 font-semibold text-slate-500">
                        $
                        {listing.offer
                           ? listing.discountprice.toLocaleString('en-US')
                           : listing.regularprice.toLocaleString('en-US')}
                           {listing.type === 'rent' && ' /month'}
                    </p>
                    <div className="text-slate-700 flex gap-4">
                        <div className="font-bold text-xs">
                            {listing.bedrooms >1
                              ? `${listing.bedrooms} Beds `
                              : `${listing.bedrooms} bed `}  
                        </div>
                        <div className="font-bold text-xs">
                            {listing.bathrooms >1
                              ? `${listing.bathrooms} Baths `
                              : `${listing.bathrooms} bath `}
                        </div>
                    </div>
                </div>
            </Link>
            </div>
    );

}
            