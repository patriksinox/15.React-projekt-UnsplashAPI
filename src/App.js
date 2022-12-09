import { Spinner, Container, Row, Button, Input, Alert } from "reactstrap";
import { GoSearch } from "react-icons/go";
import { useState, useEffect } from "react";
import Fotka from "./Fotka";

const apiKluc = process.env.REACT_APP_ACESS_KEY;
const urlBase = `https://api.unsplash.com/photos/?client_id=${apiKluc}`;
const urlQuery = `https://api.unsplash.com/search/photos/?client_id=${apiKluc}`;

function App() {
  const [nacitanie, setNacitanie] = useState(false);
  const [error, setError] = useState(false);
  const [fotky, setFotky] = useState([]);
  const [hladanie, setHladanie] = useState("");
  const [strana, setStrana] = useState(1);
  const [dole, setDole] = useState(false);

  //Odoslanie Formy
  const handlerForm = (e) => {
    e.preventDefault();
    fetchDat();
  };

  const fetchDat = async () => {
    setNacitanie(true);
    let url;
    if (hladanie) url = `${urlQuery}&page=${strana}&query=${hladanie}`;
    if (!hladanie) url = `${urlBase}&page=${strana}`;
    try {
      const resp = await fetch(`${url}`);
      const data = await resp.json();

      setFotky(() => {
        if (hladanie) {
          if (dole) {
            setDole(false);
            return [...fotky, ...data.results];
          }
          if (!dole) return [...data.results];
        }

        return [...fotky, ...data];
      });

      setDole(false);
      setNacitanie(false);
    } catch (error) {
      setError(true);
      setNacitanie(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (!dole) return;
    if (nacitanie) return;
    setStrana((strana) => strana + 1);
    // eslint-disable-next-line
  }, [dole]);

  //pri načítaní stránky
  useEffect(() => {
    fetchDat();
    // eslint-disable-next-line
  }, [strana]);

  const event = () => {
    const pozDole =
      window.scrollY + window.innerHeight >= document.body.scrollHeight - 2;
    if (pozDole) return setDole(true);
  };

  //pri scrolle dole
  useEffect(() => {
    document.addEventListener("scroll", event);
    return () => document.removeEventListener("scroll", event);
  }, []);

  return (
    <>
      <Container className=" text-center">
        <h1 className="text-center mt-5 mb-5">Databáza fotiek</h1>
        <form className="mb-5" onSubmit={handlerForm}>
          <Input
            type="text"
            placeholder="Hľadaj"
            className="input"
            onChange={(e) => setHladanie(e.target.value)}
          />
          <Button color="primary" className="hladaj">
            <GoSearch />
          </Button>
        </form>

        <Row>
          {fotky.map((fotka) => {
            return <Fotka key={fotka.id} {...fotka} />;
          })}
          {nacitanie && (
            <Spinner className="spinner nacitanie" color="primary">
              Načítávam...
            </Spinner>
          )}
        </Row>

        {error && <Alert color="danger">Problém so získaním dát z API!</Alert>}
      </Container>
    </>
  );
}

export default App;
