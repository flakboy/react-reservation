import React from "react";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { saveOptions } from "./actions";

import "antd/dist/antd.css";
import { Form, InputNumber, Button, Checkbox, Layout } from "antd";
const { Content } = Layout;

const mapDispatchToProps = dispatch => {
    return {
        saveOptions: data => {
            dispatch(saveOptions(data));
        }
    }
}

class BookingForm extends React.Component {
    constructor() {
        super()
        this.state = {
            submitted: false
        }
    }

    handleSubmit = values => {
        this.props.saveOptions({
            amount: values.amount,
            neighboring: values.neighboring
        })
        this.setState({ submitted: true });
    }

    render() {
        return (
            <Content style={{ width: "100%", minHeight: "800px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                {this.state.submitted ? <Redirect to="/select" /> : null}
                <Form onFinish={this.handleSubmit}>
                    <Form.Item
                        label="Ilość miejsc"
                        name="amount"
                        rules={[
                            {
                                required: true,
                                message: 'Proszę wprowadzić ilość miejsc!',
                            },
                        ]}

                    >
                        <InputNumber min={1} />
                    </Form.Item>
                    <Form.Item name="neighboring" valuePropName="checked">
                        <Checkbox>Czy miejsca mają być obok siebie?</Checkbox>
                    </Form.Item>
                    <Form.Item>
                        <Button htmlType="submit" block>Wybierz miejsca</Button>
                    </Form.Item>
                </Form>
            </Content>
        )
    }
}


export default connect(null, mapDispatchToProps)(BookingForm)