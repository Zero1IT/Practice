export class PlayDto {

    /**
     * @typedef {{
     *  id: Number,
     *  date: {nano: Number, epochSecond: Number}
     * }} JavaLitePlayDate
     *
     * @typedef {{
     *     id: Number,
     *     title: String,
     *     authorName: String,
     *     genreName: String,
     *     dates: Array<JavaLitePlayDate>,
     * }} JavaPlayDto
     *
     * @param dto {JavaPlayDto}
     */
    constructor(dto) {
        this._id = dto.id;
        this._title = dto.title;
        this._authorName = dto.authorName;
        this._genreName = dto.genreName;
        this._dates = dto.dates;
    }

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get title() {
        return this._title;
    }

    set title(value) {
        this._title = value;
    }

    get authorName() {
        return this._authorName;
    }

    set authorName(value) {
        this._authorName = value;
    }

    get genreName() {
        return this._genreName;
    }

    set genreName(value) {
        this._genreName = value;
    }

    get dates() {
        return this._dates;
    }

    set dates(value) {
        this._dates = value;
    }
}