import {
    FaBath,
    FaBed,
    FaChair,
    FaMapMarkerAlt,
    FaParking,
} from "react-icons/fa";

export default async function Listing({params}) {
    let listing = null;
    try {
        const result = await fetch(process.env.URL+ '/api/listing/get', {
            method: 'POST',
            body : JSON.stringify({listingId: params.id}),
            cache: 'no-store',
        });
        const data = await result.json();
        listing = data[0];
    } catch (error) {
        listing = {title: 'error fetching listing'};
    }
    if (!listing ||listing === 'failed to load listing'){
        return(
            <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
                <h1 className="text-xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-2xl">
                    Listing not found...
                </h1>
            </main>
        );
    }

    if (listing || listing.name !== 'failed to load listing'){
        return(
            <main>
                <div>
                    <img 
                    src={listing.imageUrls[0]}
                    alt={listing.name}
                    className="w-full h-400px object-cover"
                    />
                    <div className="flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4">
                        <p className="text-2xl font-semibold">
                            {listing.name}- ${' '}
                            {listing.offer
                                ? listing.discountprice.toLocaleString('en-US')
                                : listing.regularprice.toLocaleString('en-US')}
                            {listing.type === 'rent' && ' / month'}    
                        </p>
                        <p className="flex items-center mt-6 gap-2 text-slate-600 text-sm">
                            <FaMapMarkerAlt className="text-green-700" />
                            {listing.address}
                        </p>
                        <div className="flex gap-4">
                            <p className="bg-red-900 w-full max-w-50 text-white text center p-1 rounded-md">
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            {listing.offer && (
                                <p className="bg-green-900 w-full max-w-50 text-white text center p-1 rounded-md">
                                    ${+listing.regularprice - +listing.discountprice} OFF
                                    </p>
                            )}    
                        </div>
                        <p className="text-slate-800">
                            <span className="font-semibold text-black ">Description -</span>
                            {listing.description}
                        </p>
                        <ul className="text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6">
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBed className="text-lg" />
                                {listing.bedrooms >1
                                    ? `${listing.bedrooms} Beds`
                                    : `${listing.bedrooms} Bed `}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaBath className="text-lg" />
                                {listing.bathrooms >1
                                    ? `${listing.bathrooms} Baths`
                                    : `${listing.bathrooms} Bath `}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaParking className="text-lg" />
                                {listing.parking ? 'Parking Spot' : 'No Parking'}
                            </li>
                            <li className="flex items-center gap-1 whitespace-nowrap">
                                <FaChair className="text-lg" />
                                {listing.furnished ? 'Furnished' : 'Not Furnished'}
                            </li>
                        </ul>
                    </div>
                </div>
            </main>
        );
    }
}
        
    