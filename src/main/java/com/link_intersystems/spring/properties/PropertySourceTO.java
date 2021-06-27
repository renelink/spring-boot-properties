
package com.link_intersystems.spring.properties;

import java.util.List;

public class PropertySourceTO {

	private String name;

	private List<PropertyTO> properties;

	public PropertySourceTO(String name, List<PropertyTO> properties) {
		this.name = name;
		this.properties = properties;
	}

	public String getName() {
		return name;
	}

	public List<PropertyTO> getProperties() {
		return properties;
	}
}
