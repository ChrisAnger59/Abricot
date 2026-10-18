import Image, { type StaticImageData } from 'next/image';

interface AuthIllustrationProps {
    src: StaticImageData;
}

function AuthIllustration({ src }: AuthIllustrationProps) {
    return (
        <Image
            src={src}
            alt="outils de bureau"
            fill
            priority
            className='object-cover'
        />
    );
}

export default AuthIllustration;