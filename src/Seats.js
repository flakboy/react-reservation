import React from "react";
import { Redirect } from "react-router";
import { connect } from "react-redux";
import { saveReservation } from "./actions";

import "./Seats.css";
import { Button } from "antd";

const mapDispatchToProps = dispatch => {
    return {
        saveReservation: data => {
            dispatch(saveReservation(data));
        }
    }
}

const mapStateToProps = state => {
    return {
        limit: state.reservations.amount,
        neighboring: state.reservations.neighboring
    }
}

class Seats extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accepted: false,
            seats: [],
            selectedAmount: 0,
            height: 0,
            width: 0,
            amountError: false
        }
    }

    componentDidMount() {
        fetch("http://localhost:3000/seats")
            .then(data => data.json())
            .then(json => {
                let seats = json.map(item => {
                    return { ...item, selected: false }
                }).sort((a, b) => {
                    if (a.cords.y < b.cords.y) return -1;
                    else if (a.cords.y > b.cords.y) return 1;
                    else if (a.cords.x < b.cords.x) return -1;
                    else if (a.cords.x > b.cords.x) return 1;
                    else return 0
                });

                const width = Math.max(...seats.map(item => item.cords.x)) + 1;
                const height = Math.max(...seats.map(item => item.cords.y)) + 1;

                this.setState({ seats, width, height },
                    () => {
                        this.suggest(this.props.limit, this.props.neighboring);
                    }
                )
            })
            .catch(error => { console.log(error) })

    }

    getSeatsClone = () => {
        return this.state.seats.map(item => {
            let { x, y } = item.cords
            return {
                ...item,
                cords: { x, y }
            }
        });
    }

    switchSeatSelection = (x, y) => {
        let seatsClone = this.getSeatsClone();
        let difference = 0;

        let clickedSeat = seatsClone.find(item => item.cords.x === x && item.cords.y === y);
        if (!clickedSeat.reserved) {
            if (!clickedSeat.selected && this.state.selectedAmount < this.props.limit) {
                difference = 1;
                clickedSeat.selected = true;
            } else if (clickedSeat.selected) {
                clickedSeat.selected = false;
                difference = -1
            }

            this.setState({
                seats: seatsClone,
                selectedAmount: this.state.selectedAmount + difference
            });
        }
    }

    suggest = (amount, neighboring) => {
        let seatsClone = this.getSeatsClone();

        //tablica przechowuje znalezione, sąsiadujące ze sobą miejsca
        let suggestedSeats = [];

        if (neighboring) {
            let [height, width] = [this.state.height, this.state.width];

            //tworzenie tablicy dwuwymiarowej, na którą można nałożyć rozkład miejsc
            //ułatwi to dalszą iterację w poszukiwaniu wolnych, sąsiadujących ze sobą miejsc
            let matrix = (new Array(height)).fill(null, 0, height)
                .map(() => (new Array(width).fill(null, 0, width)));

            for (let seat of seatsClone) {
                let { y, x } = seat.cords
                matrix[y][x] = {
                    ...seat,
                    cords: { y, x }
                }
            }

            for (let y = 0; y < height && suggestedSeats.length < amount; y++) {
                suggestedSeats = [];
                for (let x = 0; x < width && suggestedSeats.length < amount; x++) {
                    if (matrix[y][x] !== null && !matrix[y][x].reserved) {
                        suggestedSeats.push(seatsClone.find(item => item.cords.x === x && item.cords.y === y));
                    } else {
                        suggestedSeats = [];
                    }
                }
            }
        } else {
            for (let seat of seatsClone) {
                if (!seat.reserved) {
                    suggestedSeats.push(seat);
                    if (suggestedSeats.length === amount) {
                        break;
                    };
                }
            }
        }

        if (suggestedSeats.length === amount) {
            for (let seat of suggestedSeats) {
                seat.selected = true;
            }

            this.setState({
                seats: seatsClone,
                selectedAmount: amount
            });
        } else {
            alert("Nie udało się znaleźć wystarczającej ilości miejsc.");
            this.setState({ amountError: true });
        }
    }

    onAccept = () => {
        if (this.state.selectedAmount === this.props.limit) {
            let selectedSeats = this.state.seats
                .filter(item => item.selected === true)
                .map(item => {
                    return {
                        id: item.id,
                        x: item.cords.x,
                        y: item.cords.y,
                    }
                });
            this.props.saveReservation(selectedSeats);
            this.setState({ accepted: true });
        } else {
            alert("Nie wybrano odpowiedniej ilości miejsc!");
        }
    }

    render() {
        return (
            <div>
                {this.state.amountError ? <Redirect to="/" /> : null}
                {this.state.accepted ? <Redirect to="/success" /> : null}
                <div className="seat-display" style={{ margin: "20px auto" }}>
                    {this.state.seats.map((item) => {
                        const { x, y } = item.cords
                        return (
                            <div key={item.id}
                                className={`seat-cell ${item.reserved ? "seat-cell--reserved" : ""} ${item.selected ? "seat-cell--selected" : ""}`}
                                style={{
                                    gridColumn: x + 1,
                                    gridRow: y + 1,
                                }}
                                onClick={() => { this.switchSeatSelection(x, y) }}
                            >

                            </div>)
                    })}
                </div>
                {/* <Space size={"large"}> */}
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div className="legend">
                        <div className="legend__item">
                            <div className="legend__icon"></div> miejsca dostępne
                        </div>
                        <div className="legend__item">
                            <div className="legend__icon seat-cell--reserved"></div> miejsca zarezerwowane
                        </div>
                        <div className="legend__item">
                            <div className="legend__icon seat-cell--selected"></div> twój wybór
                        </div>
                    </div>
                    <Button onClick={this.onAccept}>Rezerwuj</Button>
                </div>
                {/* </Space> */}
            </div>
        )
    }
}

// export default connect(mapStateToProps, mapDispatchToProps)(Seats);
export default connect(mapStateToProps, mapDispatchToProps)(Seats);