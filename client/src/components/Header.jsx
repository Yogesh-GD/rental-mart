
const Header = ({ children ,img}) => {
    return (
        <div
            className="relative w-full min-h-[60vh] bg-cover bg-center flex items-center px-6"
            style={{ backgroundImage: img? `url(${img})` : "url(/hbg.jpg)" }}
        >
            <div className="absolute inset-0 bg-black/50"></div>

            <div className=" z-10 relative ">
                {children}
            </div>
        </div>
    );
};

export default Header