module.exports = function timestamp(schema) {
    // Add the two fields to the schema
    schema.add({
        created_at: String,
        updated_at: String
    })
    // Create a pre-save hook
    schema.pre('save', function (next) {
        let now = new Date().toLocaleString('it-IT', {
            timeZone: 'Asia/Ho_Chi_Minh'
        });
        this.updated_at = now;
        if (!this.created_at) {
            this.created_at = now;
        }
        next()
    })
}