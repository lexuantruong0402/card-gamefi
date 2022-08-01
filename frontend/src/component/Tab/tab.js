import React from "react";
import { Col, Row, Button } from "react-bootstrap";
import "./tab.css";

function ShowTab({ setTab }) {

    return (
        <div
            className="container d-flex justify-content-center"
            style={{ paddingTop: "50px", paddingBottom: "25px" }}
        >
            <Row>
                <Col
                    className="d-flex justify-content-center"
                    style={{ padding: "5 5 5 5" }}
                >
                    <Button
                        variant="outline-primary"
                        onClick={() => {
                            setTab("card");
                        }}
                    >
                        <span className="button-text-before-click"> Cards </span>
                    </Button>
                </Col>
                <Col
                    className="d-flex justify-content-center"
                    style={{ padding: "5 5 5 5" }}
                >
                    <Button
                        variant="outline-info"
                        onClick={() => {
                            setTab("egg");
                        }}
                    >
                        <span className="button-text-before-click"> Eggs </span>
                    </Button>
                </Col>
                <Col
                    className="d-flex justify-content-center"
                    style={{ padding: "5 5 5 5" }}
                >
                    <Button
                        variant="outline-warning"
                        onClick={() => {
                            setTab("marketplace");
                        }}
                    >
                        <span className="button-text-before-click"> Marketplace </span>
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
export default ShowTab;
