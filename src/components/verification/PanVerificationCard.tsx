

interface Props {
  status?: string;
  decisionValue: string;
  onViewResult: () => void;
  onVerify: () => void;
  onDecisionChange: (value: string) => void;
  matchStatus: string;
}

function PANVerificationCard(props:Props){

return(

<div className="flex items-center gap-2 flex-wrap">


<button

onClick={props.onViewResult}

className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"

>

View Result

</button>



<span

className={`

px-4

py-2

rounded-xl

text-white

text-xs

font-bold

${props.matchStatus==="Match"

?

" bg-green-500 "

:

" bg-red-500 "

}

`}

>

{

props.matchStatus || "Pending"

}

</span>




<select

value={props.decisionValue}

onChange={(e)=>{

props.onDecisionChange(

e.target.value

)

}}

className="

border

rounded-xl

px-3

py-2

text-xs

"

>

{/* <option value="" disabled hidden>
   Decision
</option> */}

<option value="Verified">

Verified

</option>

<option value="Not Verified">

Not Verified

</option>

<option value="Fraud">

Fraud

</option>

<option value="Rejected">

Rejected

</option>

</select>




<button

type="button"

onClick={props.onVerify}

className="

px-4

py-2

bg-indigo-600

text-white

rounded-xl

text-xs

font-bold

"

>

Reverify

</button>


</div>


);

}


export default PANVerificationCard;
