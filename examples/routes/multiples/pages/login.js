import { Link } from "/src/index.js";

export default function Login(){

    return $("<div>", {
        class: "login",
        html: $("<div>", {
            class: "d-flex align-items-center justify-content-center",
            html: [
                $("<div>", {
                    class: "box border p-3 rounded",
                    html: [
                        $("<h4>", {html: "LOGIN"}),
                        $("<div>", {
                            class: "mt-4",
                            html: [
                                $("<input>", {
                                    class: "form-control",
                                    placeholder: "Username"
                                }),
                                $("<span>", {
                                    class: "mt-2 btn btn-primary d-block",
                                    html: "Entrar"
                                }),
                                $("<div>", {
                                    class: "mt-5",
                                    html: [
                                        Link({
                                            href: "/",
                                            html: "Home"
                                        })
                                    ]
                                })
                            ]
                        })
                    ]
                })
            ]
        })
    })
}