"use client"
import DisplayFacture from "@/container/DisplayFactureCanvas/DisplayFacture";
import UploadForm from "@/container/UploadDocument/UploadForm";
import { button } from "framer-motion/client";
import { useState } from "react";


export default function Home() {


    return (
        <>
            <h1> page de l'app</h1>
            <div>
                <div>
                    <h2>display de la facture</h2>


                </div>

                <div>
                    <UploadForm />
                    <DisplayFacture />
                </div>


            </div>


        </>
    );
}

