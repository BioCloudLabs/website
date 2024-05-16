const AboutUs = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-8">
                            <h1 className="text-4xl font-bold pt-8 mb-4 text-center">About Us</h1>

            <div className="max-w-screen-lg mx-auto bg-white p-8 rounded-lg shadow-md">

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2">Introduction</h2>
                    <h3 className="text-xl font-semibold mb-2">Overview of the Project</h3>
                    <p className="text-gray-700 mb-4">
                        Welcome to BioCloudLabs - Memoria, a cutting-edge project by Aymane El Hanbali, Albert Martin Moreno, Christian González Acosta, aimed at simplifying bioinformatics for users without specialized IT resources. Focused on Web Development in Bioinformatics, this project introduces an automated cloud platform for omics applications, starting with BLAST, to transform massive analysis tasks with exceptional performance and scalability.
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
                        Based on ElasticBlast: The project is inspired by the ElasticBLAST concept, which leverages cloud resources to efficiently distribute BLAST searches across multiple cloud instances, allowing for scalability and rapid processing of large datasets.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Meet the Team</h2>
                    <div className="flex flex-col md:flex-row justify-around items-center mt-8">
                        {/* Team Member 1 */}
                        <div className="bg-white shadow-lg rounded-lg p-4 mb-4 md:mb-0 md:mx-2 w-full md:w-1/3">
                            <div className="flex flex-col items-center">
                                <img src="/images/Team/Aymane.jpeg" alt="Aymane" className="w-32 h-32 object-cover rounded-full mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Aymane El Hanbali</h3>
                                <p className="text-gray-700 text-center">
                                    Aymane focuses on frontend design and infrastructure, ensuring a seamless and user-friendly interface.
                                </p>
                            </div>
                        </div>

                        {/* Team Member 2 */}
                        <div className="bg-white shadow-lg rounded-lg p-4 mb-4 md:mb-0 md:mx-2 w-full md:w-1/3">
                            <div className="flex flex-col items-center">
                                <img src="/images/Team/Christian.jpeg" alt="Christian" className="w-32 h-32 object-cover rounded-full mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Christian González Acosta</h3>
                                <p className="text-gray-700 text-center">
                                    Christian manages backend development and infrastructure, including Azure API deployment.
                                </p>
                            </div>
                        </div>

                        {/* Team Member 3 */}
                        <div className="bg-white shadow-lg rounded-lg p-4 mb-4 md:mb-0 md:mx-2 w-full md:w-1/3">
                            <div className="flex flex-col items-center">
                                <img src="/images/Team/Albert.jpeg" alt="Albert" className="w-32 h-32 object-cover rounded-full mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Albert Martin Moreno</h3>
                                <p className="text-gray-700 text-center">
                                    Albert leads the development of BLAST features, ensuring high performance and scalability.
                                </p>

                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
