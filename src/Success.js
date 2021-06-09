import React from "react";
import { connect } from "react-redux";
import { Layout, Typography } from 'antd';
const { Title } = Typography;
const { Content } = Layout;

const mapStateToProps = state => {
    return {
        reservedSeats: state.reservations.reservedSeats
    }
}

class Success extends React.Component {
    // constructor(props) {
    //     super(props);
    // }

    render() {
        return (
            <Content style={{ padding: '35px 35px' }}>
                <Title level={2}> Twoja rezerwacja przebiegła pomyślnie! </Title>
                <Title level={3}> Wybrałeś miejsca: </Title>
                <ul>
                    {
                        this.props.reservedSeats ?
                            this.props.reservedSeats.map(item => { return <li key={item.id}> {JSON.stringify(item)}</li> }) :
                            ""
                    }
                </ul>
                <Title level={4}> Dziękujemy! W razie problemów prosimy o kontakt z działem administracji</Title>
            </Content>
        )
    }
}

export default connect(mapStateToProps, null)(Success);