import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppContext from "../../features/context/AppContext";
import ProductCard from "../Group/ui/ProductCard";

export default function Product() {
    const {slug} = useParams();
    const {request} = useContext(AppContext);
    const [info, setInfo] = useState({
        slug: "",
        product: null,
        associations: []
    });
    useEffect(() => {
        request("/api/product/" + slug)
        .then(setInfo);
    }, [slug]);

    return !info.product
    ? <>
        <i>Немає такого товару</i>
    </>
    : <>
        <h1>Сторінка товару</h1>

        <div className="row">
            <div className="col col-5">
                <img className="w-100" 
                    src={info.product.imageUrl} 
                    alt={info.product.name} />
            </div>
            <div className="col col-6">
                <h2>{info.product.name}</h2>
                <p>{info.product.description}</p>
                <h3>₴ {info.product.price.toFixed(2)}</h3>
                <button className="btn btn-success">У кошик</button>
            </div>
            <div className="col col-1">Тут може бути ваша реклама</div>
        </div>

        <h3 className="mt-4">Вас також може зацікавити</h3>
        <div className="row row-cols-6 g-2 mt-2">
            {info.associations.map(product => 
                <ProductCard product={product} key={product.id} isAssociation={true} />
            )}
        </div>
    </>;
}
/*
Д.З. Удосконалити алгоритми вибору та відображення товарів розділу
 "Вас також може зацікавити":
- якщо у даній групі недостатньо товарів, то збільшити долю товарів 
   інших груп. Іншими словами, забезпечити гарантовані 6 шт. 
- також не показувати товари, що вже є у кошику
- не включати товари, кількість яких (на складі) дорівнює 0    
*/