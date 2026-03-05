import React, { useState } from 'react';

interface ProductImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    placeholderClassName?: string;
}

const ProductImage: React.FC<ProductImageProps> = ({ src, alt, className = "", placeholderClassName = "" }) => {
    const [error, setError] = useState(false);
    const firstLetter = alt ? alt.charAt(0).toUpperCase() : '?';

    if (!src || error) {
        return (
            <div className={`flex items-center justify-center bg-brand-green-light text-brand-green font-800 text-3xl select-none ${className} ${placeholderClassName}`}>
                {firstLetter}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={alt}
            className={className}
            onError={() => setError(true)}
        />
    );
};

export default ProductImage;
