exports.handler = async function() {
    return {
        statusCode: 200,
        body: JSON.stringify({
            NOMINATIM_API_URL: process.env.NOMINATIM_API_URL
        })
    };
};
