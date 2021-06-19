function grades(data) {

    return new Promise((resolve, reject) => {
        var average = 0
        var weight = 0

        if (data.length == 0) {
            reject("Vui lòng nhập dữ liệu.")
            return
        }
        data.forEach((gr, index) => {
            if (!gr.value || !gr.weight) {
                reject("Có trường bị thiếu.")
                return
            }
            if(gr.value > 10){
                reject(`Môn ${gr.title} có điểm không hợp lệ`)
            }
            data[index].value = Number(data[index].value)
            data[index].weight = Number(data[index].weight)

            data[index].grade = exchange(data[index].value).grade
            data[index].text = exchange(data[index].value).text

            average += data[index].grade * data[index].weight
            weight += data[index].weight
        })
        resolve({
            data: data,
            average: average/weight,
            weights : weight
        })
    })
}

function exchange(value) {
    if (value >= 9) {
        return {
            grade: 4,
            text: 'A'
        }
    }
    if (value >= 8) {
        return {
            grade: 3.5,
            text: 'B+'
        }
    }
    if (value >= 7) {
        return {
            grade: 3,
            text: 'B'
        }
    }
    if (value >= 6.5) {
        return {
            grade: 2.5,
            text: 'C+'
        }
    }
    if (value >= 5.5) {
        return {
            grade: 2,
            text: 'C'
        }
    }
    if (value >= 5) {
        return {
            grade: 1.5,
            text: 'D+'
        }
    }
    if (value >= 4) {
        return {
            grade: 1,
            text: 'D'
        }
    }
    return {
        grade: 0,
        text: 'F'
    }
}

module.exports = grades