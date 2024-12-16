export function onlineOffline(token) {
    const url = "http://localhost:4000/graphql";


    const mutationOnline = `
        mutation {
            inputLog(userName: "${token}", status: "online") {
                status
            }
        }
    `;

    const mutationOffline = `
        mutation {
            inputLog(userName: "${token}", status: "offline") {
                status
            }
        }
    `;

    window.addEventListener("load", async () => {
        await axios.post(url, { query: mutationOnline });
    });


    window.addEventListener("online", async () => {
        await axios.post(url, { query: mutationOnline });
    });


    window.addEventListener("offline", async () => {
        await axios.post(url, { query: mutationOffline });
    });


    window.addEventListener("beforeunload", async () => {
        await axios.post(url, { query: mutationOffline });
    });
}