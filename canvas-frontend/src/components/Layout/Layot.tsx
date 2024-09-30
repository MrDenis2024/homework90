import React from 'react';


const Layout: React.FC<React.PropsWithChildren> = ({children}) => {
  return (
    <>
      <header className="navbar navbar-dark bg-success">
        <div className="container justify-content-center">
          <h1 className="text-light">Canvas</h1>
        </div>
      </header>
      <main className='container flex-grow-1'>
        {children}
      </main>
      <footer className='bg-success'>
        <div className="container text-center">
          <p className='my-4 text-light'>Made by Denis Khrunev student Attractor school 2024</p>
        </div>
      </footer>
    </>
  );
};

export default Layout;