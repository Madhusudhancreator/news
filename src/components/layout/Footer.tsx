import BodyContainer from '../common/BodyContainer';
import Link from 'next/link';
import Image from 'next/image';
import StayTuned from '../common/StayTuned';
// import DownloadApp from '../common/DownloadApp';

const Footer: React.FC = () => {
    return (
        <div className='bg-[url(/footer-bg.jpg)] bg-no-repeat bg-cover bg-center md:mt-10 mt-4'>
            <div className='bg-[#ffffffbb] pt-8'>
                <BodyContainer>
                    <div className='grid justify-center lg:grid-cols-3 md:grid-cols-4 grid-cols-1 items-center md:gap-6 gap-2'>
                        <div className='lg:col-span-1 md:col-span-2 text-center'>
                            <StayTuned />
                        </div>
                        <div className='lg:col-span-1 md:col-span-2 md:mt-5'>
                            <Link href={"/"}>
                                <Image
                                    className='lg:w-[220px] md:w-[200px] w-[140px] lg:mx-auto md:ml-auto md:mx-0 mx-auto md:mt-0 mt-4'
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/logocitynews.png`}
                                    alt='logo'
                                    width={220}
                                    height={150}
                                />
                            </Link>
                        </div>
                        {/* <div className='lg:col-span-1 md:col-span-4 lg:my-0 md:my-3 my-0 flex h-full mx-auto'>
                            <DownloadApp />
                        </div> */}
                    </div>
                </BodyContainer>
                {/* footer menu */}
                <div className='bg-base-content py-1 px-5 my-4 md:my-8'>
                    <BodyContainer>
                        <ul className='flex flex-wrap lg:justify-between justify-center md:gap-x-8 gap-x-5 gap-y-2 md:gap-y-3 text-white text-lg md:text-2xl'>
                            <li className="hover:text-blue-500"><Link href="/about">About Us</Link></li>
                            <li className="hover:text-blue-500"><Link href="/advertisement">Advertisement Policy</Link></li>
                            <li className="hover:text-blue-500"><Link href="/comment-policy">Comment Policy</Link></li>
<li className="hover:text-blue-500"><Link href="/privacy-policy">Privacy Policy</Link></li>
                            <li className="hover:text-blue-500"><Link href="/contact">Contact</Link></li>
                        </ul>
                    </BodyContainer>
                </div>
                <div className='text-center text-xl'>
                    <p><b>Editor &amp; Publisher:</b> Matiur Rahman Tuku</p>
                    <p>&copy; 2025 All Rights Reserved</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;
