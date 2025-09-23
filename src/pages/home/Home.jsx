import { useContext, useState } from "react";
import AppContext from "../../features/context/AppContext";
import Calc from "../../widgets/calc/Calc";

export default function Home() {
    const {user} = useContext(AppContext);     // hook
    const [count, setCount] = useState(0);     // hook

    const onCountClick = () => {
        setCount(count + 1);
    };

    return <div className="text-center">
        <h1 className="display-4">Крамниця</h1>
        <div className="row">
            <div className="col">
                <button className="btn btn-primary" onClick={onCountClick}>+1</button>
                <h3>Підсумок: {count}</h3>

                {!!user && <p>Вітання, {user.Name}</p>}
                
                <hr/>
                <CountWidget count={count} setCount={setCount} />  {/* Prop Drilling */}
            </div>
            <div className="col"><Calc /></div>
        </div>        
    </div>;
}

function CountWidget(props) {  // Prop Drilling
    return <div className="border p-2 m-3">
        Ваш підсумок: {props.count}
        <button className="btn btn-danger" onClick={() => props.setCount(0)}>Скинути</button>
    </div>
}