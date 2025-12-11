import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-blue-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">Acorn Sports</Link>
                <div className="space-x-4">
                    <Link to="/" className="hover:text-blue-200">Book Court</Link>
                    <Link to="/admin" className="hover:text-blue-200">Admin</Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
