"use client";

import Image from "next/image";
import { useState } from "react";

export default function ImageGallery({ images, name }) {
    const [activeIndex, setActiveIndex] = useState(0);

    if (!images || images.length === 0) {
        return (
            <div className="relative w-full h-[400px] bg-gray-100 flex items-center justify-center">
                <p className="text-gray-400">No images available</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative w-full h-[420px] md:h-[520px] overflow-hidden rounded-xl bg-gray-100">
                <Image
                    src={images[activeIndex]}
                    alt={`${name} - photo ${activeIndex + 1}`}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover transition-opacity duration-300"
                />
                {/* Counter badge */}
                <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                    {activeIndex + 1} / {images.length}
                </div>
            </div>

            {/* Thumbnails — only shown if more than 1 image */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((url, i) => (
                        <button
                            key={url}
                            onClick={() => setActiveIndex(i)}
                            className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-150
                                ${i === activeIndex ? 'border-slate-700 opacity-100' : 'border-transparent opacity-60 hover:opacity-90'}`}
                        >
                            <Image
                                src={url}
                                alt={`thumbnail ${i + 1}`}
                                fill
                                sizes="80px"
                                className="object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
