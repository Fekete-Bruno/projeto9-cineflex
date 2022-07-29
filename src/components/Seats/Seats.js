import "./style.css";
import InnerHeader from "../InnerHeader/InnerHeader";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

export default function Seats(){
    const {sessionId} = useParams();
    const apiURL= `https://mock-api.driven.com.br/api/v7/cineflex/showtimes/${sessionId}/seats`
    const [seatsInfo, setSeatsInfo] = useState(null);
    const [selectedSeats,setSelectedSeats] = useState([]);
    useEffect(()=>{
        const promise = axios.get(apiURL);
        promise.then((response)=>{
            setSeatsInfo(response.data);
        })
    },[])

    function addSeats(){
        const newArray = seatsInfo.seats.filter((seat)=>{return (seat.clicked)}).map((seat)=>{return(seat.id)});
        setSelectedSeats([...newArray]);
    }

    return(
        <div>
        <InnerHeader text={"Selecione o(s) assento(s)"} />
        {(!seatsInfo)?(<div>Carregando...</div>):(
            <>
            <div className="seats">{
                seatsInfo.seats.map((seat,index)=>{return(
                <Seat key={seat.id} index={index} name={seat.name} available={(seat.isAvailable)?("available"):("unavailable")} seatsInfo={seatsInfo} addSeats={addSeats}/>
                )})}
            </div>

            <Examples/>
            <ClientData selectedSeats={selectedSeats}/>

            <div className="footer">
                <div className="img-container"><img src={seatsInfo.movie.posterURL} alt={seatsInfo.movie.title} /></div>
                <div className="title">
                    {seatsInfo.movie.title} <br/>
                    {seatsInfo.day.weekday} - {seatsInfo.name}
                </div>
            </div>
            </>
        )}
        </div>
    );
}
function Seat({name , available, index, seatsInfo,addSeats}){
    const [clicked,setClicked] = useState(false);

    function testaAssento(){
        if(available==="available"){
            setClicked(!clicked);    
            seatsInfo.seats[index].clicked=!clicked;
            addSeats();
        }else{
            alert("Esse assento não está disponível...");
        } 
    }

    return(
        <div onClick={testaAssento} className={"seat "+ available + " " + clicked}>{name}</div>
    );
}

function Examples(){
    return(
        <div className="examples">
            <div className="example">
            <div className="seat true"></div>
            Selecionado
            </div>

            <div className="example">
            <div className="seat available"></div>
            Disponível
            </div>

            <div className="example">
            <div className="seat unavailable"></div>
            Indisponível
            </div>
        </div>
    );
}

function ClientData({selectedSeats}){
    const[name,setName] = useState("");
    const[cpf,setCpf] = useState("");
    const postURL ="https://mock-api.driven.com.br/api/v7/cineflex/seats/book-many"
    
    const regex = /^\d{3}\.?\d{3}\.?\d{3}\-?\d{2}$/;
    
    function login (event) {
		event.preventDefault();
        if(!regex.test(cpf)){
            alert("Escreva o CPF novamente (na forma 12345678900 ou 123.456.789-00)")
        } else if (selectedSeats.length===0){
            alert("Selecione pelo menos um assento...")
        }else{
            const request = axios.post(postURL,
                {
                   ids:selectedSeats,
                   name:name,
                   cpf:cpf, 
                });
            request.then(()=>console.log('Success!'));
            request.catch(()=>console.log("error"))
            console.log(name,cpf,selectedSeats);
        }
    }

    
    return (
		<form onSubmit={login}>
            <div>Nome do comprador:</div>
		    <input type="text" required value={name} onChange={e => setName(e.target.value)} />
            <div>CPF do comprador:</div>
		    <input type="text" required value={cpf} onChange={e => setCpf(e.target.value)} />
            <div></div>
            {/*<Link to="/sucesso">*/}
		    <button type="submit">Reservar Assento(s)</button>
            {/*</Link>*/}
		</form>
	);
}