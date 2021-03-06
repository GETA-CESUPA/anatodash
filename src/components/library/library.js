//Libs Imports
import React, { Component } from "react";
import api from "../../services/api";

//Styles
import {
  Container,
  ListGeneral,
  ListContainer,
  ButtonContainer,
  SearchBox,
  ListWrapper
} from "../../styles/global";

import {
  ThemeBox,
  ThemeContainer,
  PiecesContainer,
  PieceBox,
  PiecesList,
  ThemeBoxContainer,
  IndividualPieceContainer,
  PieceImagesContainer,
  PieceImage
} from "./styles";

// Images imports
import AddButton from "../../assets/plus.png";
import Magnifier from "../../assets/magnifier.png";
import Pencil from "../../assets/pencil.png";
import CloseButton from "../../assets/xMark2.png";

export default class Library extends Component {
  constructor(props) {
    super(props);
    this.state = {
      themes: [],
      isAdmin: false,
      isEditing: false,
      isSelected: false,
      pieces: [],
      searchInput: ""
    };
    this.getThemes();
  }

  chooseImage = () => {
    var wind = window.open("asda", "Escolha a imagem");
    if (wind.closed) {
      console.log("buceta");
    }
  };

  getThemes = async () => {
    try {
      const themes = await api.get("/theme");
      this.setState({
        themes: themes.data
      });
    } catch (response) {
      console.log(response);
    } finally {
      console.log(this.state.themes);
    }
  };

  handleSearch = e => {
    this.setState(
      {
        searchInput: e.target.value
      },
      () => this.renderThemes(this.state.searchInput)
    );
  };

  renderThemes() {
    let { themes, searchInput } = this.state;
    searchInput = searchInput.trim().toLowerCase();

    if (searchInput.length > 0) {
      themes = themes.filter(theme => {
        return theme.name.toLowerCase().match(searchInput);
      });
    }

    return themes.map(theme => (
      <ThemeBoxContainer key={theme.id}>
        <ThemeBox
          onClick={() => this.getPiecesList(theme.id)}
          style={{ borderColor: theme.color }}
        >
          <div className="textBox">
            <p>{theme.name}</p>
          </div>
          <div className="imageBox">
            <img alt="" src={theme.image.url} />
          </div>
        </ThemeBox>
        <img src={Pencil} alt="" />
      </ThemeBoxContainer>
    ));
  }

  renderPiecesList() {
    return this.state.pieces.map(piece => (
      <PieceBox key={piece.id}>
        <p>{piece.name}</p>
        <img alt="" src={piece.regular.url} />
      </PieceBox>
    ));
  }

  createTheme() {}

  getPiecesList = async e => {
    try {
      const { data } = await api.get("/theme/" + e + "/pieces");
      console.log(data.library);
      this.setState({
        pieces: data.library
      });
    } catch (response) {
      console.log(response);
    } finally {
      console.log(this.state.pieces);
    }
  };

  renderPieceImages() {
    return this.state.pieces.map(piece => (
      <PieceImage key={piece.id}>
        <div className="Name">
          <p>Nome da peça:</p>
          <input placeholder="Digite o nome da peça" value={piece.name} />
        </div>
        <ul className="Images">
          <img src={CloseButton} alt="" />
        </ul>
      </PieceImage>
    ));
  }

  render() {
    return (
      <Container>
        <div
          style={{
            height: "100%",
            width: "240px",
            backgroundColor: "#008BA3"
          }}
        ></div>
        <ListGeneral style={{ width: "50%" }}>
          <ListContainer>
            <h1>Biblioteca</h1>
            <SearchBox>
              <img alt="" src={Magnifier} />
              <input
                placeholder="Digite o nome do tema"
                onChange={this.handleSearch}
                value={this.state.searchInput}
              />
            </SearchBox>
            <ListWrapper>{this.renderThemes()}</ListWrapper>
          </ListContainer>
          <ButtonContainer>
            {this.state.isAdmin ? <img src={AddButton} alt="" /> : null}
          </ButtonContainer>
        </ListGeneral>
        {this.state.pieces.length !== 0 ? (
          <ThemeContainer>
            <div className="Button">
              <img alt="" src={CloseButton} />
            </div>
            <PiecesContainer>
              <h1>Peças</h1>
              <SearchBox>
                <img alt="" src={Magnifier} />
                <input placeholder="Digite o nome do tema" />
              </SearchBox>
              <PiecesList>{this.renderPiecesList()}</PiecesList>
            </PiecesContainer>
            <IndividualPieceContainer>
              <div className="Button">
                <img alt="" src={CloseButton} />
              </div>
              <PieceImagesContainer>
                {this.renderPieceImages()}
              </PieceImagesContainer>
            </IndividualPieceContainer>
          </ThemeContainer>
        ) : (
          <ThemeContainer style={{ backgroundColor: "whitesmoke" }} />
        )}
      </Container>
    );
  }
}
