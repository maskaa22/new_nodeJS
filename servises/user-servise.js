module.exports = {
    createdUser: (schema, answer) => schema.create(answer),
    findAllUser: (schema, answer = {}) => {
        const {
            perPage = 20,
            page = 1,
            sortBy = 'createdAt',
            order = 'asc',
            ...filters
        } = answer;

        const findObject = {};
        const ageFilter = {};

        Object.keys(filters).forEach((filterParam) => {
            switch (filterParam) {
                case 'name':
                    findObject.name = { $regex: `^${filters.name}`, $options: 'i' };
                    break;
                case 'role':
                    const rolesArr = filters.role.split(';');

                    findObject.role = { $in: rolesArr };
                    break;
                case 'age.gte':
                    Object.assign(ageFilter, { $lte: +filters['age.gte'] });
                    break;
                case 'age.lte':
                    Object.assign(ageFilter, { $lte: +filters['age.lte'] });
                    break;
            }
        });

        if (Object.values(ageFilter).length) {
            findObject.age = ageFilter;
        }

        const orderBy = order === 'asc' ? -1 : 1;

        return schema
            .find(findObject)
            .sort({ [sortBy]: orderBy })
            .limit(+perPage)
            .skip((page - 1) * perPage);
    },
    findOneUser: (schema, answer) => schema.findOne({ email: answer }),
    findUserById: (schema, answer) => schema.findById(answer),
    deleteOneUser: (schema, answer) => schema.deleteOne({ _id: answer }),
    updateUserById: (schema, answer, newUser) => schema.updateOne({ _id: answer }, newUser),
};
