import axios from "./axios";


export const getFraudCases = async () => {

    const response = await axios.get(

        "/fraud/cases"

    );

    return response.data;

};



export const getFraudCase = async (

    candidateId:number

) => {

    const response = await axios.get(

        `/fraud/cases/${candidateId}`

    );


    return response.data.data;

};




export const approveFraudCase = async (

    candidateId:number,

    module:string

) => {


    const response = await axios.put(

        `/fraud/approve/${candidateId}`,

        {

            module

        }

    );


    return response.data;

};




export const rejectFraudCase = async (

    candidateId:number,

    module:string

) => {


    const response = await axios.put(

        `/fraud/reject/${candidateId}`,

        {

            module

        }

    );


    return response.data;

};




export const requestReverification = async (

    candidateId:number,

    module:string

) => {


    const response = await axios.put(

        `/fraud/reverify/${candidateId}`,

        {

            module

        }

    );


    return response.data;

};