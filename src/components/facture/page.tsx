import UploadPage from "@/components/uploadPdf";



export default async function Home() {
    return (
        <>
            <div className="flex items-center justify-center  min-h-screen bg-gray-100">
                <div className="flex flex-col items-center justify-center space-y-8 w-[90%] bg-white p-8 rounded-lg shadow-lg">
                    <UploadPage></UploadPage>
                </div>
            </div>
        </>
    );
}