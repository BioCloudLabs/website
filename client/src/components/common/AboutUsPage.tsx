const AboutUs = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-4xl font-bold pt-8 mb-4 text-center">About Us</h1>
            <div className="max-w-screen-lg mx-auto bg-white p-8 rounded-lg shadow-md">
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
                    <h3 className="text-xl font-semibold mb-2">Overview of the Project</h3>
                    <p className="text-gray-700 mb-4">
                        Welcome to BioCloudLabs, a bioinformatics project focused on automated cloud processes for omics applications. Starting with BLAST, it aims to transform massive analysis tasks with exceptional performance and scalability.
                        <a href="/register" className="font-bold text-blue-600"> Join us now.</a>
                    </p>
                </section>
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Project Idea</h2>
                    <h3 className="text-xl font-semibold mb-2">Description of the Project Idea</h3>
                    <p className="text-gray-700 mb-4">
                        The project in one sentence:
                    </p>
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700 mb-4">
                        “Automated cloud deployment of pay-per-use omics applications, starting with BLAST, for users who need to perform massive point-in-time analysis with high performance needs.”
                    </blockquote>
                    <p className="text-gray-700 mb-4">
                    </p>
                </section>
                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Meet the Team</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                        {/* Team Member 1 */}
                        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                            <img src="/images/Team/Aymane.jpeg" alt="Aymane photo" className="w-32 h-32 object-cover rounded-full mb-4" />
                            <h3 className="text-xl font-semibold mb-1 text-center">
                                Aymane El Hanbali
                            </h3>
                            <p className="text-gray-700 text-center overflow-hidden text-ellipsis mb-4">
                                Aymane focuses on frontend design and infrastructure, ensuring a seamless and user-friendly interface.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://www.linkedin.com/in/aymane-/" target='_blank' className="group">
                                    <svg className="w-6 h-6 text-blue-700 group-hover:text-blue-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.09 20.48H3.56V9h3.53v11.48zM5.33 7.52c-1.12 0-2.03-.91-2.03-2.03 0-1.12.91-2.03 2.03-2.03 1.12 0 2.03.91 2.03 2.03 0 1.12-.91 2.03-2.03 2.03zM20.48 20.48h-3.53v-5.55c0-1.32-.03-3.01-1.83-3.01-1.83 0-2.11 1.43-2.11 2.91v5.65h-3.53V9h3.39v1.57h.05c.47-.89 1.61-1.83 3.32-1.83 3.55 0 4.21 2.33 4.21 5.36v6.38z" />
                                    </svg>
                                    <span className="sr-only">LinkedIn account</span>
                                </a>
                                <a href="https://github.com/SirAymane" target='_blank' className="text-gray-700 hover:text-gray-900 group">
                                    <svg className="w-6 h-6 group-hover:fill-black fill-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">GitHub account</span>
                                </a>
                            </div>
                        </div>

                        {/* Team Member 2 */}
                        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                            <img src="/images/Team/Christian.jpeg" alt="Christian photo" className="w-32 h-32 object-cover rounded-full mb-4" />
                            <h3 className="text-xl font-semibold mb-1 text-center">
                                Christian González Acosta
                            </h3>
                            <p className="text-gray-700 text-center overflow-hidden text-ellipsis mb-4">
                                Christian manages backend development and infrastructure, including Azure API deployment.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://www.linkedin.com/in/christian-gonzalez-acosta/" target='_blank' className="group">
                                    <svg className="w-6 h-6 text-blue-700 group-hover:text-blue-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.09 20.48H3.56V9h3.53v11.48zM5.33 7.52c-1.12 0-2.03-.91-2.03-2.03 0-1.12.91-2.03 2.03-2.03 1.12 0 2.03.91 2.03 2.03 0 1.12-.91 2.03-2.03 2.03zM20.48 20.48h-3.53v-5.55c0-1.32-.03-3.01-1.83-3.01-1.83 0-2.11 1.43-2.11 2.91v5.65h-3.53V9h3.39v1.57h.05c.47-.89 1.61-1.83 3.32-1.83 3.55 0 4.21 2.33 4.21 5.36v6.38z" />
                                    </svg>
                                    <span className="sr-only">LinkedIn account</span>
                                </a>
                                <a href="https://github.com/Chrisgoac" target='_blank' className="text-gray-700 hover:text-gray-900 group">
                                    <svg className="w-6 h-6 group-hover:fill-black fill-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">GitHub account</span>
                                </a>
                            </div>
                        </div>

                        {/* Team Member 3 */}
                        <div className="bg-white shadow-lg rounded-lg p-4 flex flex-col items-center">
                            <img src="/images/Team/Albert.jpeg" alt="Albert photo" className="w-32 h-32 object-cover rounded-full mb-4" />
                            <h3 className="text-xl font-semibold mb-1 text-center">
                                Albert Martin Moreno
                            </h3>
                            <p className="text-gray-700 text-center overflow-hidden text-ellipsis mb-4">
                                Albert leads the development of BLAST features, ensuring high performance and scalability.
                            </p>
                            <div className="flex space-x-4">
                                <a href="https://www.linkedin.com/in/albert-mart%C3%ADn-moreno-75443a303/" target='_blank' className="group">
                                    <svg className="w-6 h-6 text-blue-700 group-hover:text-blue-900" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                        <path d="M22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0zM7.09 20.48H3.56V9h3.53v11.48zM5.33 7.52c-1.12 0-2.03-.91-2.03-2.03 0-1.12.91-2.03 2.03-2.03 1.12 0 2.03.91 2.03 2.03 0 1.12-.91 2.03-2.03 2.03zM20.48 20.48h-3.53v-5.55c0-1.32-.03-3.01-1.83-3.01-1.83 0-2.11 1.43-2.11 2.91v5.65h-3.53V9h3.39v1.57h.05c.47-.89 1.61-1.83 3.32-1.83 3.55 0 4.21 2.33 4.21 5.36v6.38z" />
                                    </svg>
                                    <span className="sr-only">LinkedIn account</span>
                                </a>
                                <a href="https://github.com/albertmartinmoreno" target='_blank' className="text-gray-700 hover:text-gray-900 group">
                                    <svg className="w-6 h-6 group-hover:fill-black fill-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
                                    </svg>
                                    <span className="sr-only">GitHub account</span>
                                </a>
                            </div>
                        </div>


                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
